import type { Dictionary } from "@/i18n/locales/en";

interface FooterProps {
  dict: Dictionary;
}

export default function Footer({ dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-stone-800 bg-black text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-lg font-bold text-white">{dict.company.name}</p>
            <p className="mt-1 text-sm">{dict.footer.tagline}</p>
          </div>
          <p className="text-sm text-stone-500">
            &copy; {year} {dict.footer.copyrightName}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
