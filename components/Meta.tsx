import Head from "next/head";
import { FC } from "react";
interface Props {
  title?: string;
  keywords?: string;
  description?: string;
}
const Meta: FC<Props> = ({
  title = "Firebase private chat",
  keywords = "Firebase chat application, Nextjs chat application, Typescript chat application, Herbert Kavuma",
  description = "Firebase private chat application with nextjs, typescript and SASS",
}) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  );
};

export default Meta;
