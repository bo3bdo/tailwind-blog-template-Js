import 'animate.css'
import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'
import Image from 'next/image'
import SocialIcon from '@/components/social-icons'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="my-8 flex w-full content-between justify-center gap-4 p-5">
        <div className="w-full">
          <div className="flex">
            <h1 className="pb-6 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Hi, I'm Bo3bdo
            </h1>
            <div className="animate__animated animate__tada animate__slower animate__infinite infinite ml-5	text-6xl">
              👋
            </div>
          </div>

          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Hi, my name is bo3bdo. a full-stack web developer working at Web. In this publication, I
            share everything I know about Laravel And Web, packages, and tools. Browse the list of
            topics or check the latest posts from below.
          </p>
        </div>
        <div className="flex w-1/2 flex-col items-center">
          <div>
            <Image
              src="/static/images/5271380.jpeg"
              alt="bo3bdo"
              width={200}
              height={200}
              className="rounded-full shadow-md"
            />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">full-stack web developer</p>
          </div>
          <div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href="bo3bdo@hotmail.com" />
              <SocialIcon kind="github" href="https://github.com/bo3bdo" />
              <SocialIcon kind="twitter" href="https://twitter.com/Hamad3bdulla" />
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latest Posts
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <div key={slug} className="w-full py-12">
                <article className="flex">
                  <div className="col-span-2 items-center justify-center space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0">
                    <div className="w-full">
                      {/* if no image */}

                      {frontMatter.image && (
                        <Link href={`/blog/${slug}`}>
                          <Image
                            className="rounded-lg"
                            src={frontMatter.image}
                            alt={frontMatter.title}
                            width={250}
                            height={150}
                          />
                        </Link>
                      )}

                      {!frontMatter.image && 'No Image'}
                    </div>

                    <div className="ml-5 auto-cols-max space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4"></div>
      )}
    </>
  )
}
