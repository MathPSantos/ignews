import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";

import { Async } from '.'

describe('Async component', () => {
  it('render correctly', async () => {
    render(<Async />)

    expect(screen.getByText('Hello World')).toBeInTheDocument()

    // When needs to wait to something appear on screen
    // expect(await screen.findByText('Button', {}, { timeout: 3000 })).toBeInTheDocument()

    // await waitFor(() => {
    //   return expect(screen.getByText('Button')).toBeInTheDocument()
    // }, {
    //   interval: 1000
    // })

    // When needs to wait to something disappear on screen
    // await waitFor(() => {
    //   return expect(screen.queryByText('Button')).not.toBeInTheDocument()
    // }, {
    //   interval: 1000
    // })

    await waitForElementToBeRemoved(screen.queryByText('Button'))
  })
})