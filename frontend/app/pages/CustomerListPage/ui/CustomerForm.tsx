import {useRemixFormContext} from 'remix-hook-form';
import type {UpdateCustomer} from '~/shared/domain/Customer.model';
import {Button, Flex, Grid, Stack, TextInput} from '@mantine/core';
import {useNavigate} from 'react-router';
import {TbChevronLeft, TbDeviceFloppy} from 'react-icons/tb';

export function CustomerForm({editable = false}: { editable?: boolean }) {
    const {register, formState: {errors}} = useRemixFormContext<UpdateCustomer>()
    const readOnly = !editable;
    const variant = editable ? "default" : "filled";
    const size = editable ? "sm" : "md";
    const navigate = useNavigate();
    return <Stack gap={size}>
        <Grid>
            <Grid.Col span={6}>
                <TextInput label={"First name"} {...register('firstName')} placeholder={"First Name"}
                           error={errors.firstName?.message} readOnly={readOnly} variant={variant} size={size}/>
            </Grid.Col>
            <Grid.Col span={6}>
                <TextInput label={"Last Name "} {...register('lastName')} error={errors.lastName?.message}
                           readOnly={readOnly} variant={variant} size={size}/>
            </Grid.Col>
        </Grid>
        <TextInput label={"Company"}{...register('company')} error={errors.company?.message} readOnly={readOnly}
                   variant={variant} size={size}/>
        <Grid>
            <Grid.Col span={4}>
                <TextInput label={"Email"}{...register('email')} error={errors.email?.message} readOnly={readOnly}
                           variant={variant} size={size}/>
            </Grid.Col>
            <Grid.Col span={4}>
                <TextInput label={"Phone"}{...register('phone')} error={errors.phone?.message} readOnly={readOnly}
                           variant={variant} size={size}/>
            </Grid.Col>
            <Grid.Col span={4}>
                <TextInput label={"Fax"}{...register('fax')} error={errors.fax?.message} readOnly={readOnly}
                           variant={variant} size={size}/>
            </Grid.Col>
        </Grid>
        <Grid>
            <Grid.Col span={4}>
                <TextInput label={"Address"}{...register('address')} error={errors.address?.message}
                           readOnly={readOnly} variant={variant} size={size}/>
            </Grid.Col>
            <Grid.Col span={4}>
                <TextInput label={"City"}{...register('city')} error={errors.city?.message} readOnly={readOnly}
                           variant={variant} size={size}/>
            </Grid.Col>
            <Grid.Col span={4}>
                <TextInput label={"Postal Code"}{...register('postalCode')} error={errors.postalCode?.message}
                           readOnly={readOnly} variant={variant} size={size}/>
            </Grid.Col>
        </Grid>
        <TextInput label={"State"}{...register('state')} error={errors.state?.message} readOnly={readOnly}
                   variant={variant} size={size}/>
        <TextInput label={"Country"}{...register('country')} error={errors.country?.message} readOnly={readOnly}
                   variant={variant} size={size}/>
        {editable && <Flex gap={"md"}><Button type="submit" leftSection={<TbDeviceFloppy size={20}/>}>Save</Button><Button variant="light" onClick={() => { navigate(-1)}} leftSection={<TbChevronLeft size={20}/>}>Back</Button></Flex>}

    </Stack>;
}
