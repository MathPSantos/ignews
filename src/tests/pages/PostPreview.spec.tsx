import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { getPrismicClient } from '../../services/prismic'

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'

const post = {
  slug: 'my-new-post',
  title:  'Meu novo Post',
  content: '<p>lorem ipsum</p>',
  updatedAt: '12 de março de 2021'
}

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText('Meu novo Post')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () =>  {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: 'fake-activeSubscription'
      }, 
      false
    ])

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<Post post={post} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('load initial data', async () =>  {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'Meu novo Post' }
          ],
          content: [
            { type: 'paragraph', text: 'lorem ipsum' }
          ]
        },
        last_publication_date: '03-12-2021'
      })
    } as any)

    const response = await getStaticProps({ params: { slug: 'my-new-post' }})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post
        }
      })
    )
  })
})