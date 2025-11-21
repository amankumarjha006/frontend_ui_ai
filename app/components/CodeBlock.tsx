type Props = {
  code: string;
};

export default function CodeBlock({ code }: Props) {
  return (
    <pre className="bg-black text-green-400 p-4 rounded overflow-auto text-sm max-h-96 whitespace-pre-wrap">
      {code}
    </pre>
  );
}
