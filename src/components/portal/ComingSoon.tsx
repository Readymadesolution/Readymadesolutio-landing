export default function ComingSoon({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-col items-center gap-2 rounded-[16px] border border-dashed border-hairline bg-white px-6 py-20 text-center">
        <p className="font-sans text-[16px] font-semibold text-secondary-900">
          {title}
        </p>
        <p className="max-w-[360px] font-sans text-[13.5px] text-secondary-500">
          {note}
        </p>
      </div>
    </div>
  );
}
