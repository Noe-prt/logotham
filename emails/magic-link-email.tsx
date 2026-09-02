import { Button, Container, Head, Html, Preview, Text, Body } from "@react-email/components";

interface MagicLinkEmailProps {
  magicLink: string;
  userName?: string;
}

export const MagicLinkEmail = ({ magicLink, userName }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Sign in to Logotham</Preview>
    <Body
      style={{
        backgroundColor: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <Container
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          margin: "0 auto",
          maxWidth: "480px",
          padding: "2rem",
        }}
      >
        <Text
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Sign in to Logotham
        </Text>

        <Text
          style={{
            fontSize: "1rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          Hi {userName || "there"}, click the button below to sign in to your account.
        </Text>

        <Container
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <Button
            href={magicLink}
            style={{
              backgroundColor: "#000000",
              borderRadius: "0.375rem",
              color: "#ffffff",
              display: "inline-block",
              fontSize: "1rem",
              fontWeight: "500",
              padding: "0.75rem 1.5rem",
              textDecoration: "none",
            }}
          >
            Sign in to Logotham
          </Button>
        </Container>

        <Text
          style={{
            fontSize: "0.875rem",
            textAlign: "center",
            color: "#6b7280",
          }}
        >
          This link will expire in 10 minutes. If you didn&apos;t request this link, you can safely ignore this email.
        </Text>

        <Text
          style={{
            fontSize: "0.875rem",
            marginTop: "1rem",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          The Logotham Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default MagicLinkEmail;