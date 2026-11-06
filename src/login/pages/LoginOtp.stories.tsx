import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-otp.ftl" });

const meta = {
    title: "login/login-otp.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithMultipleDevices: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                otpLogin: {
                    selectedCredentialId: "device-1",
                    userOtpCredentials: [
                        { id: "device-1", userLabel: "iPhone Authenticator" },
                        { id: "device-2", userLabel: "YubiKey OTP" }
                    ]
                }
            }}
        />
    )
};

export const WithError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (fieldName: string) => fieldName === "totp",
                    get: (fieldName: string) => (fieldName === "totp" ? "Invalid authenticator code." : "")
                }
            }}
        />
    )
};
