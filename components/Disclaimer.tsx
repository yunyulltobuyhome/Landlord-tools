export default function Disclaimer({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <p className="mt-10 rounded-xl border border-line bg-sand/60 px-4 py-3 font-sans text-xs leading-relaxed text-ink/50">
      {children ?? (
        <>
          Landlord Tools provides self-help templates and general
          information, not legal advice, and is not a law firm. Using this
          tool does not create an attorney-client relationship and does not
          guarantee any outcome. Landlord-tenant rules vary by state and
          locality and change over time — confirm your current requirements
          with the applicable statute or a licensed attorney before relying
          on any result.
        </>
      )}
    </p>
  );
}
