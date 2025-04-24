import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);
  fireEvent.click(screen.getByText(/View Questions/i));

  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {

  // Go to the form
  fireEvent.click(screen.queryByText("New Question"));

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/), {
    target: { value: "Test Answer 3" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/), {
    target: { value: "Test Answer 4" },
  });
  fireEvent.change(screen.getByLabelText(/Correct Answer/), {
    target: { value: "1" },
  });

  // Submit the form
  fireEvent.click(screen.getByText(/Add Question/i));

  // Assert that the new question appears immediately
  await waitFor(() => {
    expect(screen.getByText(/Test Prompt/i)).toBeInTheDocument();
  });
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.getByText(/View Questions/));

  await screen.findByText(/lorem testum 1/i);

  fireEvent.click(screen.getAllByText("Delete Question")[0]);

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/lorem testum 1/i)
  );

  rerender(<App />);
  await screen.findByText(/lorem testum 2/i);

  expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/View Questions/));
  await screen.findByText(/lorem testum 2/i);

  fireEvent.change(screen.getAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  await waitFor(() =>
    expect(screen.getAllByLabelText(/Correct Answer/)[0].value).toBe("3")
  );
});