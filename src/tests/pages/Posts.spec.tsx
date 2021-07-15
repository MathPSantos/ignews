import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import { getPrismicClient } from '../../services/prismic'

import Posts, { getStaticProps } from '../../pages/posts'

const posts = [
  {
    slug: 'my-new-post',
    title:  'Meu novo Post',
    excerpt: 'lorem ipsum',
    updatedAt: '12 de março de 2021'
  }
]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('Meu novo Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'Meu novo Post' }
              ],
              content: [
                { type: 'paragraph', text: 'lorem ipsum' }
              ]
            },
            last_publication_date: '03-12-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts
        }
      })
    )
  })
})