"use client";

/* eslint-disable @next/next/no-img-element */

import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import type { ReactNode } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Chat", href: "/chat" },
  { name: "Settings", href: "/chat/settings" },
];

const isPathActive = (pathname: string, href: string) => {
  if (href === "/chat/settings" && pathname.startsWith("/chat/settings")) {
    return true;
  } else if (href === "/chat" && !pathname.startsWith("/chat/settings")) {
    return pathname.startsWith(href);
  }
};

const Sidebar = ({ isMobile }: { isMobile?: boolean }) => {
  const pathname = usePathname();

  return (
    <div
      className={`flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 ${
        isMobile ? "pb-2" : "border-r border-gray-200"
      }`}
    >
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {/* Navigation Items */}
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`${
                      isPathActive(pathname, item.href)
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    }
                                    group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6`}
                  >
                    {/*
                                  <item.icon
                                    className={classNames(
                                      item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                    */}
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your teams
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {/* Sub items */}
              <li>
                <a
                  href=""
                  className={`${
                    true
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  }
                                    group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6`}
                >
                  <span
                    className={`${
                      true
                        ? "border-indigo-600 text-indigo-600"
                        : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600"
                    }
                                      flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium`}
                  >
                    N
                  </span>
                  <span className="truncate">Name</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Mobile hamburger menu */}
      <Transition.Root show={show} as={Fragment}>
        <Dialog
          as="div"
          className="lb:hidden relative z-50"
          onClose={() => setShow(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setShow(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar Content */}
                <Sidebar isMobile={true} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar Content */}
        <Sidebar />
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setShow(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Dashboard
        </div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </a>
      </div>

      {/* Main area */}
      {children}
    </>
  );
};
