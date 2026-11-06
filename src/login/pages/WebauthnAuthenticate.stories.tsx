import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "webauthn-authenticate.ftl" });

const meta = {
    title: "login/webauthn-authenticate.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithMultipleAuthenticators: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                shouldDisplayAuthenticators: true,
                authenticators: {
                    authenticators: [
                        {
                            credentialId: "cred-1",
                            label: "MacBook Touch ID",
                            createdAt: "2026-01-15",
                            transports: {
                                iconClass: "kcAuthenticatorWebAuthnDefaultClass",
                                displayNameProperties: ["Internal"]
                            }
                        },
                        {
                            credentialId: "cred-2",
                            label: "YubiKey 5C NFC",
                            createdAt: "2026-03-10",
                            transports: {
                                iconClass: "kcAuthenticatorWebAuthnDefaultClass",
                                displayNameProperties: ["USB", "NFC"]
                            }
                        }
                    ]
                }
            }}
        />
    )
};
