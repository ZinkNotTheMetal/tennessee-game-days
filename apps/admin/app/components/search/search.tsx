"use client";

export function Search({
  placeholder,
  value,
  onChange,
}: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <>
      <div className="relative text-gray-600 focus-within:text-gray-400">
        <input
          autoComplete="off"
          className="border border-gray-300 rounded-full pl-10 pr-6 py-2 w-full text-gray-500 focus:text-black focus:outline-none focus:ring focus:border-blue-30"
          name="search"
          onChange={onChange}
          placeholder={placeholder}
          type="search"
          value={value}
        />
      </div>
    </>
  );
}

export default Search;
