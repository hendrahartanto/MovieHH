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
  CreateLocationInput,
  createLocationInputSchema,
  useCreateLocation,
} from "@/features/locations/api/create-location";
import { Authorization, ROLES } from "@/lib/authorization";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

export const CreateLocation = () => {
  const createLocation = useCreateLocation({
    mutationConfig: {
      onSuccess: () => {
        // TODO: add toast notification
        form.reset();
      },
    },
  });

  const form = useForm<CreateLocationInput>({
    resolver: zodResolver(createLocationInputSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmit = (data: CreateLocationInput) => {
    createLocation.mutate({ data });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Create Location"
        isDone={createLocation.isSuccess}
        triggerButton={
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Location
          </Button>
        }
        submitButton={
          <SubmitButton
            form="create-location-form"
            type={SubmitButtonType.CREATE}
            isPending={createLocation.isPending}
          >
            Create Location
          </SubmitButton>
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="create-location-form"
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
