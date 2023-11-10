import { useToast } from "@/components/ui/hooks/use-toast";
import { useState } from "react";
import Container from "./container";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Toasts() {
  const [content, setContent] = useState(
    'Failed to toast, requires at least one toaster to be available.',
  )
  const { toast } = useToast();

  return <Container title="Toast">
    <Text variant="h2">Toast</Text>
    <Input value={content} onChange={e => setContent(e.target.value)} />
    <Button onClick={() => toast({ content })}>Toast</Button>
  </Container>
}