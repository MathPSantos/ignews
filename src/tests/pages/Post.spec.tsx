import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { getSession } from 'next-auth/client'

import { getPrismicClient } from '../../services/prismic'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'

const post = {
  slug: 'my-new-post',
  title:  'Meu novo Post',
  content: '<p>lorem ipsum</p>',
  updatedAt: '12 de março de 2021'
}

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('Meu novo Post')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () =>  {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' }} as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )
  })

  it('load initial data', async () =>  {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-activeSubscription'
    })

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

    const response = await getServerSideProps({ params: { slug: 'my-new-post' }} as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post
        }
      })
    )
  })
})