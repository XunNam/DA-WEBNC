import Image from "next/image";
import Link from "next/link";
import { Baloo_Paaji_2 } from "next/font/google";
import NavbarLink from "./NavbarLink";
import DropDownState from "./dropDownMenu/DropDownState";

const balooPaaji2 = Baloo_Paaji_2({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});


const Navbar = () => {

  return (
    <nav
      className={`${balooPaaji2.className}
        py-[20px]
        px-[40px]
        border-b-[1px]
        border-[#d1d5db]
        w-screen
        h-[100px]`}
    >
      <div
        className={`flex
            flex-col
            justify-center
            w-full h-full`}
      >
        <div
          className={`flex flex-row justify-between items-center
            w-full h-full`}
        >
          <Link href="/">
            <div className="w-[150px]">
              <Image
                src="/site-logo.svg"
                alt="Site logo"
                width={100}
                height={0}
                className="w-full h-auto"
              />
            </div>
          </Link>
          <div className={`hidden lg:flex`}>
            <NavbarLink />
          </div>
          <div
            className={`flex
                    flex-row
                    items-center
                    justify-center
                    gap-x-[30px]`}
          >
            <div
              className={`flex
                        flex-row
                        justify-center
                        items-center
                        gap-x-[10px]`}
            >
              <div>
                <p
                  className={`text-[18px]
                                    pt-[5px]
                                    font-semibold
                                    text-[#5f4ecb]`}
                >
                  0.00 VNĐ
                </p>
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="#5f4ecb"
                  className="bi bi-basket2-fill cursor-pointer"
                  viewBox="0 0 20 20 "
                >
                  <path d="M5.929 1.757a.5.5 0 1 0-.858-.514L2.217 6H.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.623l1.844 6.456A.75.75 0 0 0 3.69 15h8.622a.75.75 0 0 0 .722-.544L14.877 8h.623a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.717L10.93 1.243a.5.5 0 1 0-.858.514L12.617 6H3.383zM4 10a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm3 0a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0zm4-1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1" />
                </svg>
              </div>
            </div>
            <div className={`lg:hidden`}>
              <DropDownState />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
