import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSheet } from "@/components/ui/form/form-sheet";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UpdateLocationInput,
  updateLocationInputSchema,
  useUpdateLocation,
} from "@/features/locations/api/update-location";
import { Authorization, ROLES } from "@/lib/authorization";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { Location } from "../../types";
import { useNotifications } from "@/components/ui/notification/notification-store";

interface UpdateLocationProps {
  location: Location;
}

export const UpdateLocation = ({ location }: UpdateLocationProps) => {
  const updateLocation = useUpdateLocation({
    mutationConfig: {
      onSuccess: (response) => {
        useNotifications.getState().addNotification({
          type: "success",
          title: "Success",
          message: response.message,
        });
      },
    },
  });

  const form = useForm<UpdateLocationInput>({
    resolver: zodResolver(updateLocationInputSchema),
    defaultValues: {
      name: location.name,
      address: location.address,
    },
  });

  const onSubmit = (data: UpdateLocationInput) => {
    updateLocation.mutate({ data, locationId: location.id });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Update Location"
        isDone={updateLocation.isSuccess}
        triggerButton={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        }
        submitButton={
          <SubmitButton
            form="update-location-form"
            type={SubmitButtonType.UPDATE}
            isPending={updateLocation.isPending}
          >
            Update Location
          </SubmitButton>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="update-location-form"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter location address"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </FormSheet>
    </Authorization>
  );
};
