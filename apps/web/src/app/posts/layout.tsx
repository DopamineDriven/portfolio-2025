export default function BlogLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto max-w-4xl py-10">{children}</div>;
}
