import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { forwardRef } from "react";
import { TbChevronRight as IconChevronRight } from "react-icons/tb";
import classes from "./user-button.module.css";

export const UserButton = forwardRef<HTMLButtonElement>((props, ref) => (
	<UnstyledButton className={classes.user} ref={ref}>
		<Group>
			<Avatar
				src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
				radius="xl"
			/>

			<div style={{ flex: 1 }}>
				<Text size="sm" fw={500}>
					Harriette Spoonlicker
				</Text>

				<Text c="dimmed" size="xs">
					hspoonlicker@outlook.com
				</Text>
			</div>

			<IconChevronRight size={14} strokeWidth={1.5} />
		</Group>
	</UnstyledButton>
));
