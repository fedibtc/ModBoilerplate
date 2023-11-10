import { Avatar } from "@/components/ui/avatar";
import Container from "./container";

export default function Avatars() {
  const sizes = ["lg", "md", "sm", "xs"] as const;
  const shapes = ["circle", "square"] as const;

  return (
    <Container title="Avatar">
      {shapes.map((shape) => (
        <div className="flex flex-col gap-[20px]" key={shape}>
          {sizes.map((size) => (
            <div className="flex gap-[10px]" key={size}>
              <Avatar
                id="one"
                src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
                name="Test Dude"
                shape={shape}
                size={size}
              />
              <Avatar id="two" name="Test Dude" shape={shape} size={size} />
              <Avatar
                id="three"
                name="Test Dude"
                shape={shape}
                size={size}
                icon="IconSocial"
                holo
              />
            </div>
          ))}
        </div>
      ))}
    </Container>
  );
}