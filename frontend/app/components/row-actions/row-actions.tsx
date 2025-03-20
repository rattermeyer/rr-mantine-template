import {
	ActionIcon,
	Button,
	Center,
	Flex,
	Modal,
	Stack,
	Tooltip,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { TbDetails, TbEdit, TbTrash } from "react-icons/tb";
import { Form, NavLink } from "react-router";

export function RowActions({
	id,
	keyDisplay,
	urlPrefix,
	showDetailsLink = false,
}: {
	id: string;
	keyDisplay: string;
	urlPrefix: string;
	showDetailsLink?: boolean;
}) {
	const [opened, { open, close }] = useDisclosure();
	const isMobile = useMediaQuery("(max-width: 50em)");
	const iconSize = 24;
	return (
		<Flex gap="sm">
			<Tooltip label={`Edit item ${keyDisplay}`} position="left">
				<ActionIcon
					size={"md"}
					variant={"transparent"}
					aria-label={`Edit item ${keyDisplay}`}
					component={NavLink}
					to={`${urlPrefix}/edit/${id}`}
				>
					<TbEdit size={iconSize} />
				</ActionIcon>
			</Tooltip>
			{showDetailsLink && (
				<Tooltip label={`Details for ${keyDisplay}`} position="left">
					<ActionIcon
						size={"md"}
						variant={"transparent"}
						aria-label={`Details for ${keyDisplay}`}
						component={NavLink}
						to={`${urlPrefix}/details/${id}`}
					>
						<TbDetails size={iconSize} />
					</ActionIcon>
				</Tooltip>
			)}
			<Tooltip label={`Delete item ${keyDisplay}`} position="left">
				<ActionIcon
					size={"md"}
					variant={"transparent"}
					aria-label={`Delete item ${keyDisplay}`}
					onClick={open}
				>
					<TbTrash size={iconSize} color={"red"} />
				</ActionIcon>
			</Tooltip>
			<Modal
				opened={opened}
				onClose={close}
				title={"Delete Confirmation"}
				fullScreen={isMobile}
				centered
			>
				<Stack gap="md">
					<Center>Are you sure you want to delete the following item?</Center>
					<Center>{keyDisplay}</Center>
					<Flex>
						<Form action={`${urlPrefix}/delete`} method="delete">
							<input type="hidden" name="id" value={id} />
							<Button
								color="red"
								type="submit"
								onSubmit={close}
								onClick={close}
							>
								Delete
							</Button>
						</Form>
					</Flex>
				</Stack>
			</Modal>
		</Flex>
	);
}
