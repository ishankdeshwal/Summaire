import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex justify-center items-center lg:min-h-[40vh]">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative right-[calc(50%-36rem)] aspect-[1155/678] w-[36.125rem]
                       -translate-x-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500
                       opacity-40 sm:left-[calc(90%-36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.14% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0%, 80.7% 2%, 72.5% 32.5%, 66.2% 44.2%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 54.2%, 27.5% 76.7%, 11.6% 94.6%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-sm normal-case",
            },
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </section>
  );
}
