import { SettingsCogIcon } from "~/components/icons";
import type { Props } from "~/components/types";

export const Header = ({ children }: Props) => {
  return (
    <div className="flex justify-between border-b-2 border-gray-200 py-3 sm:items-center">
      {children}
    </div>
  );
};

export const HeaderName = ({ children }: Props) => {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-col leading-tight">
        <div className="mt-1 flex items-center text-2xl">
          <h2 className="mr-3 text-2xl font-bold text-gray-900">{children}</h2>
        </div>
      </div>
    </div>
  );
};

export const SettingsButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border text-gray-500 transition duration-500 ease-in-out hover:bg-gray-300 focus:outline-none"
        onClick={onClick}
      >
        <SettingsCogIcon />
      </button>
    </div>
  );
};
