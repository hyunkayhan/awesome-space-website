import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Markdown from "markdown-to-jsx";
import React from "react";

interface Props {
  markdownContent: string
}

interface LinkProps {
  href?: string,
  className?: string,
  title?: string,
  children: React.ReactNode;
}

const MarkdownLink =(props: LinkProps) => {
  const processedProps = React.useMemo(() => {
    if (props.href) {
      if (props.href[0] === '#') {
        return {
          target: undefined,
          href: props.href
        }
      }
      if (props.href.toLowerCase().substring(0,4) === 'http') {
        return {
          target: '_blank',
          href: props.href
        }
      } else {
        return {
          target: '_blank',
          href: `${process.env.NEXT_PUBLIC_REPO_RAW_URL}${props.href}`
        }
      }
    }
    return {
      target: undefined,
      href: undefined
    }
  }, [props.href]);

  return (
    <a href={processedProps.href} target={processedProps.target} className={props.className} title={props.title}>{props.children}</a>
  )
}

export default function Home(props: Props) {
  return (
    <>
      <Head>
        <title>{`Awesome-space.org`}</title>
        <meta name="description" content="A curated list of space-related code, APIs, data, and other resources" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <div className={styles["markdown-container"]}>
          <Markdown
            options={{
              overrides: {
                a: MarkdownLink
              },
            }}
          >
            {props.markdownContent}
          </Markdown>
          <h2>Parsing</h2>
          <p>Markdown parsed by <a href="https://www.kayhan.space" target="_blank">Kayhan Space</a></p>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  const mdUrl = process.env.NEXT_PUBLIC_MD_URL;
  const mdData = mdUrl ? await fetch(mdUrl) : null;
  if (mdData) {
    const mdStr = await mdData.text();
    return {
      props: {
        markdownContent: mdStr
      }
    }
  }
  
  return {
    props: {
      markdownContent: "Markdown could not be fetched..."
    }
  }
}