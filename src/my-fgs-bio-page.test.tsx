import React from "react"
import {screen, render} from "@testing-library/react"

import { MyFgsBioPage } from "MyFgsBioPage";

describe("MyFgsBioPage", () => {
    it("should render the component", () => {
        render(<MyFgsBioPage contentLanguage="en_US" message="World"/>);

        expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    })
})
