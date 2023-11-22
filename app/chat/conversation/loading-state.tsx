import Message from "./message";

export default function LoadingState() {
  return (
    <div className="grow relative">
      <div className="absolute inset-0 flex flex-col gap-md overflow-auto px-md py-sm">
        <Message
          message={{
            content: "Lorem Ipsum",
            role: "user",
          }}
          loading
        />
        <Message
          message={{
            content:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
            role: "system",
          }}
          loading
        />
        <Message
          message={{
            content: "Lorem ipsum dolor sit amet, consectetur",
            role: "user",
          }}
          loading
        />
        <Message
          message={{
            content: "Sed ut perspiciatis unde omnis iste natus error",
            role: "system",
          }}
          loading
        />
        <Message
          message={{
            content: "Consectetur adipiscing elit",
            role: "user",
          }}
          loading
        />
        <Message
          message={{
            content: "Quis autem vel eum",
            role: "system",
          }}
          loading
        />
      </div>
    </div>
  );
}
