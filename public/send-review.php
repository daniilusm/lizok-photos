#!/usr/bin/env php
<?php
/**
 * SMTP endpoint for review form (REG.RU).
 * Uses the same send-contact.config.php as the contact form.
 * Form POSTs JSON to /send-review.php
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
  exit;
}

$configPath = __DIR__ . '/send-contact.config.php';
if (!is_file($configPath)) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Конфиг формы не найден. Создайте send-contact.config.php',
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

/** @var array $config */
$config = require $configPath;

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '[]', true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Неверный формат запроса'], JSON_UNESCAPED_UNICODE);
  exit;
}

$shootType = trim((string)($data['shootType'] ?? ''));
$name = trim((string)($data['name'] ?? ''));
$text = trim((string)($data['text'] ?? ''));

$errors = [];
if ($shootType === '') $errors[] = 'shootType';
if (mb_strlen($name) < 2) $errors[] = 'name';
if (mb_strlen($text) < 10) $errors[] = 'text';
if (mb_strlen($text) > 4000) $errors[] = 'text';

if ($errors) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Неверные данные формы'], JSON_UNESCAPED_UNICODE);
  exit;
}

$to = (string)($config['to'] ?? '');
$host = (string)($config['smtp_host'] ?? '');
$port = (int)($config['smtp_port'] ?? 465);
$user = (string)($config['smtp_user'] ?? '');
$pass = (string)($config['smtp_password'] ?? '');
$secure = (string)($config['smtp_secure'] ?? 'ssl');
$from = (string)($config['from'] ?? $user);

if ($to === '' || $host === '' || $user === '' || $pass === '') {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'SMTP не настроен'], JSON_UNESCAPED_UNICODE);
  exit;
}

$subject = 'Отзыв с сайта: ' . $name;
$bodyText = "Новый отзыв с сайта Lizok Photos\n"
  . "Тип фотосессии: {$shootType}\n"
  . "Имя: {$name}\n"
  . "Текст отзыва:\n{$text}\n";

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

try {
  sendSmtpReview([
    'host' => $host,
    'port' => $port,
    'secure' => $secure,
    'user' => $user,
    'pass' => $pass,
    'from' => $from,
    'to' => $to,
    'subject' => $encodedSubject,
    'body' => $bodyText,
  ]);

  echo json_encode([
    'success' => true,
    'message' => 'Спасибо! Отзыв отправлен',
  ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Ошибка при отправке. Попробуйте позже.',
  ], JSON_UNESCAPED_UNICODE);
}

/**
 * @param array{host:string,port:int,secure:string,user:string,pass:string,from:string,to:string,subject:string,body:string} $opts
 */
function sendSmtpReview(array $opts): void
{
  $remote = ($opts['secure'] === 'ssl' ? 'ssl://' : '') . $opts['host'] . ':' . $opts['port'];
  $errno = 0;
  $errstr = '';
  $fp = stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT);
  if (!$fp) {
    throw new RuntimeException("SMTP connect failed: {$errstr}");
  }
  stream_set_timeout($fp, 20);

  $read = function () use ($fp): string {
    $data = '';
    while ($str = fgets($fp, 515)) {
      $data .= $str;
      if (isset($str[3]) && $str[3] === ' ') break;
    }
    return $data;
  };

  $write = function (string $cmd) use ($fp): void {
    fwrite($fp, $cmd . "\r\n");
  };

  $expect = function (string $prefix) use ($read): void {
    $resp = $read();
    if (strpos($resp, $prefix) !== 0) {
      throw new RuntimeException('SMTP unexpected: ' . trim($resp));
    }
  };

  $expect('220');
  $write('EHLO lizok-a-ph.ru');
  $expect('250');

  if ($opts['secure'] === 'tls') {
    $write('STARTTLS');
    $expect('220');
    if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
      throw new RuntimeException('STARTTLS failed');
    }
    $write('EHLO lizok-a-ph.ru');
    $expect('250');
  }

  $write('AUTH LOGIN');
  $expect('334');
  $write(base64_encode($opts['user']));
  $expect('334');
  $write(base64_encode($opts['pass']));
  $expect('235');

  $write('MAIL FROM:<' . $opts['from'] . '>');
  $expect('250');
  $write('RCPT TO:<' . $opts['to'] . '>');
  $expect('250');
  $write('DATA');
  $expect('354');

  $headers = [
    'From: Lizok Photos <' . $opts['from'] . '>',
    'To: <' . $opts['to'] . '>',
    'Subject: ' . $opts['subject'],
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  $write(implode("\r\n", $headers) . "\r\n\r\n" . $opts['body'] . "\r\n.");
  $expect('250');
  $write('QUIT');
  fclose($fp);
}
