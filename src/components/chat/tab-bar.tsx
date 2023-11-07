"use client";

import { usePathname } from "next/navigation";

export interface Tab {
  name: string;
  href: string;
}

interface Props {
  title: string;
  tabs: Tab[];
}

export const TabBar = ({ title, tabs }: Props) => {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-gray-200 px-4 sm:flex sm:items-baseline">
      <h3 className="hidden text-base font-semibold leading-6 text-gray-900 lg:block">
        {title}
      </h3>
      <div className="mt-4 lg:ml-10">
        <div className="">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={`${
                  pathname === tab.href
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }
                  whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium`}
                aria-current={pathname === tab.href ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
