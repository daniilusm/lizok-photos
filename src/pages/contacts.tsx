import type { GetStaticProps } from "next";

import { ContactsPage } from "@/_pages/contacts/ui";
import { contactsSeo, withCmsSeo } from "@/shared/seo";

const Page = () => {
  return <ContactsPage />;
};

export const getStaticProps: GetStaticProps = async () => ({
  props: withCmsSeo(contactsSeo),
});

export default Page;
