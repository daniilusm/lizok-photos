import * as THREE from "three";

import { TOUCH_TEXTURE } from "../constants";
import { easeOutSine } from "./easing";

type TouchPoint = {
  x: number;
  y: number;
  age: number;
  force: number;
};

export class TouchTexture {
  readonly texture: THREE.Texture;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly size = TOUCH_TEXTURE.size;
  private readonly maxAge = TOUCH_TEXTURE.maxAge;
  private readonly radius = TOUCH_TEXTURE.radius;
  private readonly trail: TouchPoint[] = [];

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.size;
    this.canvas.height = this.size;

    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Unable to create touch texture context");
    }

    this.ctx = ctx;
    this.clear();

    this.texture = new THREE.Texture(this.canvas);
    this.texture.needsUpdate = true;
  }

  update() {
    this.clear();

    for (let index = this.trail.length - 1; index >= 0; index -= 1) {
      const point = this.trail[index];
      point.age += 1;

      if (point.age > this.maxAge) {
        this.trail.splice(index, 1);
      }
    }

    for (const point of this.trail) {
      this.drawTouch(point);
    }

    this.texture.needsUpdate = true;
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0;
    const last = this.trail[this.trail.length - 1];

    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      const dd = dx * dx + dy * dy;
      force = Math.min(dd * 10000, 1);
    }

    this.trail.push({
      x: point.x,
      y: point.y,
      age: 0,
      force,
    });
  }

  dispose() {
    this.texture.dispose();
  }

  private clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.size, this.size);
  }

  private drawTouch(point: TouchPoint) {
    const pos = {
      x: point.x * this.size,
      y: (1 - point.y) * this.size,
    };

    let intensity = 1;

    if (point.age < this.maxAge * 0.3) {
      intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
    } else {
      intensity = easeOutSine(
        1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7),
        0,
        1,
        1,
      );
    }

    intensity *= point.force;

    const touchRadius = this.size * this.radius * intensity;
    const gradient = this.ctx.createRadialGradient(
      pos.x,
      pos.y,
      touchRadius * 0.25,
      pos.x,
      pos.y,
      touchRadius,
    );

    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");

    this.ctx.beginPath();
    this.ctx.fillStyle = gradient;
    this.ctx.arc(pos.x, pos.y, touchRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
