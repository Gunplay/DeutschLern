import Link from "next/link";
import { GraduationCap, Github, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">DeutschLern</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Сучасна платформа для вивчення німецької мови. Від A1 до C2 — разом з
              найкращими викладачами.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Платформа</h4>
            <ul className="space-y-2.5">
              {[
                ["Курси", "/courses"],
                ["Ціни", "/#pricing"],
                ["Про нас", "/#about"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Підтримка</h4>
            <ul className="space-y-2.5">
              {[
                ["FAQ", "/faq"],
                ["Зв'язок", "/contact"],
                ["Умови", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} DeutschLern. Всі права захищені.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
