"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Input from "../input";
import Wallpapers from "../wallpapers";
import { Wallpaper } from "@/types/wallpaper";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";

interface Props {
  wallpapers: Wallpaper[];
  setWallpapers: Dispatch<SetStateAction<Wallpaper[]>>;
}
export default function Example({ wallpapers, setWallpapers }: Props) {
  const { openSignIn } = useClerk(); // 获取登录方法
  const { isSignedIn } = useUser(); // 检查是否已登录
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [credits, setCredits] = useState(0);
  const fetchUserInfo = async () => {
    const response = await fetch("/api/get-user-info");
    const { code, message, data } = await response.json();
    console.log(code, message, data);
    if (data && data.credits) {
      setCredits(data.credits.left_credits);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1 ml-[400px]">
            <a href="#" className="-m-1.5 p-1.5 flex">
              <img alt="" src="/logo.svg" className="h-[150px] w-auto" />
              <h1 className="flex mt-11 text-balance text-5xl font-semibold tracking-tight text-pink-500 sm:text-6xl">
                YTAIwallpaper
              </h1>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end mr-[950px]">
            {/* 用户未登录时重定向到登录页面 */}
            {isSignedIn ? (
              <>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "40px", // 设置宽度
                        height: "40px", // 设置高度
                        borderRadius: "50%", // 圆形头像
                      },
                    },
                  }}
                />

                <button className="flex ">
                  <img className="flex ml-6 w-12" src="/icon.svg" />
                  <a href="/pricing" className="flex mt-4">
                    余额：{credits}
                  </a>
                </button>
              </>
            ) : (
              <a
                href="#"
                onClick={() => openSignIn()}
                className="text-sm/6 font-semibold text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8 h-[730px]">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:flex sm:justify-center"></div>
          <div className="text-center">
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-pink-500 sm:text-7xl">
              AIwallpaper壁纸生成器
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              让每一面屏幕都展现你的独一无二，由AI为你定制专属的视觉盛宴！
            </p>
          </div>
          <div className="flex ml-[130px] mt-10">
            <Input setWallpapers={setWallpapers} />
          </div>

          <div className="flex justify-center mt-6">
            <h1 className="text-5xl text-balance font-semibold tracking-tight text-pink-500 sm:text-7xl">
              列表展示
            </h1>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-50rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
      <div className="flex flex-wrap space-x-9 gap-4">
        {" "}
        <Wallpapers wallpapers={wallpapers} />
      </div>
    </div>
  );
}
