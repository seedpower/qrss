import Link from "next/link";
import { getTranslator } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getTranslator();
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-serif text-3xl">{t.notFound.title}</h1>
      <p className="mt-3 text-sm text-ink/60">{t.notFound.description}</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm text-cream"
      >
        {t.notFound.home}
      </Link>
    </div>
  );
}
