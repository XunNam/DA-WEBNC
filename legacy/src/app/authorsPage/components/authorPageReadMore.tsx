type AuthorPageReadMore = {
  text: string;
  link: string;
};

const AuthorPageReadMore = ({ text, link }: AuthorPageReadMore) => {
  return (
    <a
      href={link}
      target="_blank"
      className={`px-[25px] py-[12px]
    inline-flex rounded-md absolute
    hover:scale-[1.1] my-[30px]
    border-[1px] border-[#4d3bc6]
    text-[#4d3bc6] hover:bg-[#4d3bc6]
    hover:border-none hover:text-white
    transition-all duration-200 ease-in-out
    `}
    >
      {text}
    </a>
  );
};

export default AuthorPageReadMore;
