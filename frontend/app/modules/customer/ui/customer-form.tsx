import { Button, Flex, Grid, Stack, TextInput } from "@mantine/core";
import { TbChevronLeft, TbDeviceFloppy } from "react-icons/tb";
import {NavLink, useNavigate} from "react-router";
import { useRemixFormContext } from "remix-hook-form";
import {updateCustomer, type UpdateCustomer} from "~/shared/domain/customer.model";
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

export const updateCustomerForm = updateCustomer.extend({
    action: z.string()
})

export type UpdateCustomerForm = z.infer<typeof updateCustomerForm>

export const updateCustomerResolver = zodResolver(updateCustomerForm)


export function CustomerForm({ editable = false }: { editable?: boolean }) {
	const {
		register,
		formState: { errors, isSubmitting },
	} = useRemixFormContext<UpdateCustomer>();
	const readOnly = !editable;
	const variant = editable ? "default" : "filled";
	const size = editable ? "sm" : "md";
	const navigate = useNavigate();
	return (
		<Stack gap={size}>
            <input type="hidden" {...register("customerId")} />
			<Grid>
				<Grid.Col span={6}>
					<TextInput
						label={"First name"}
						{...register("firstName")}
						placeholder={"First Name"}
						error={errors.firstName?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput
						label={"Last Name "}
						{...register("lastName")}
						error={errors.lastName?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
			</Grid>
			<TextInput
				label={"Company"}
				{...register("company")}
				error={errors.company?.message}
				readOnly={readOnly}
				variant={variant}
				size={size}
			/>
			<Grid>
				<Grid.Col span={4}>
					<TextInput
						label={"Email"}
						{...register("email")}
						error={errors.email?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
				<Grid.Col span={4}>
					<TextInput
						label={"Phone"}
						{...register("phone")}
						error={errors.phone?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
				<Grid.Col span={4}>
					<TextInput
						label={"Fax"}
						{...register("fax")}
						error={errors.fax?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
			</Grid>
			<Grid>
				<Grid.Col span={4}>
					<TextInput
						label={"Address"}
						{...register("address")}
						error={errors.address?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
				<Grid.Col span={4}>
					<TextInput
						label={"City"}
						{...register("city")}
						error={errors.city?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
				<Grid.Col span={4}>
					<TextInput
						label={"Postal Code"}
						{...register("postalCode" )}
						error={errors.postalCode?.message}
						readOnly={readOnly}
						variant={variant}
						size={size}
					/>
				</Grid.Col>
			</Grid>
			<TextInput
				label={"State"}
				{...register("state")}
				error={errors.state?.message}
				readOnly={readOnly}
				variant={variant}
				size={size}
			/>
			<TextInput
				label={"Country"}
				{...register("country")}
				error={errors.country?.message}
				readOnly={readOnly}
				variant={variant}
				size={size}
			/>
			{editable && (
				<Flex gap={"md"}>
					<Button type="submit"
                            disabled={isSubmitting}
                            name="action"
                            value={"save"}
                            leftSection={<TbDeviceFloppy size={20} />}>
						Save
					</Button>
					<Button
						variant="light"
                        type="submit"
                        disabled={isSubmitting}
                        name={"action"}
                        value={"back"}
						leftSection={<TbChevronLeft size={20} />}
					>
						Back
					</Button>
				</Flex>
			)}
		</Stack>
	);
}
