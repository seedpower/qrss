import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-serif text-3xl">没有找到</h1>
      <p className="mt-3 text-sm text-ink/60">这条订阅或文章可能已被删除。</p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm text-cream"
      >
        回到首页
      </Link>
    </div>
  );
}
