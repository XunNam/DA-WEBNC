import { Metadata } from "next"
import BuyBook from "./components/buyBook"

export const metadata: Metadata = {
    title: "Bookstore | Mua sách",
    description: "Trang mua sách"
}

export default function BuyBookPage() {
    return (
        <div>
            <BuyBook />
        </div>
    )
}