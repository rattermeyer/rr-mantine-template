import { Button, type ButtonProps } from "@mantine/core";
import { TbBrandBluesky as IconBrandBluesky } from "react-icons/tb";

export function TwitterButton(
	props: ButtonProps & React.ComponentPropsWithoutRef<"button">,
) {
	return (
		<Button
			leftSection={<IconBrandBluesky size={16} color="#00ACEE" />}
			variant="default"
			{...props}
		/>
	);
}
