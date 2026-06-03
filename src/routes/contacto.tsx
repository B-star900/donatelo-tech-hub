import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/cart";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — DONATELO" },
      { name: "description", content: "Hablá con nosotros por WhatsApp, mail o teléfono." },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-brand">Contacto</p>
      <h1 className="mt-2 font-display text-4xl font-black md:text-6xl">Estamos para ayudarte.</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Respondemos en minutos por WhatsApp. También por mail o teléfono si preferís.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {[
          {
            icon: MessageCircle,
            title: "WhatsApp",
            value: "Chat directo",
            href: `https://wa.me/${WHATSAPP_NUMBER}`,
          },
          { icon: Mail, title: "Email", value: "hola@donatelo.com", href: "mailto:hola@donatelo.com" },
          { icon: Phone, title: "Teléfono", value: "+53 54633440", href: "tel:+5354633440" },
        ].map(({ icon: Icon, title, value, href }) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener"
            className="group rounded-3xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-elegant"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-brand-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
            <p className="mt-1 text-muted-foreground">{value}</p>
            <p className="mt-4 text-sm font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
              Contactar →
            </p>
          </a>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-border bg-surface p-8">
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="h-5 w-5 text-brand" />
          <span>Showroom · Buenos Aires, Argentina · Lun a Sáb 10–19hs</span>
        </div>
      </div>
    </div>
  );
}
