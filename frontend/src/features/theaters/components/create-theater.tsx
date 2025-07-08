import { Authorization, ROLES } from "@/lib/authorization";
import {
  useCreateTheater,
  createTheaterInputSchema,
  CreateTheaterInput,
} from "../api/create-theater";
import { FormSheet } from "@/components/ui/form/form-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Plus } from "lucide-react";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { useLocations } from "@/features/locations/api/get-locations";

export const CreateTheater = () => {
  const { data: locationsData, isLoading: isLoadingLocations } = useLocations({
    all: true,
  });

  const createTheater = useCreateTheater({
    mutationConfig: {
      onSuccess: () => {
        // TODO: add toast notification
        form.reset();
      },
    },
  });

  const form = useForm<CreateTheaterInput>({
    resolver: zodResolver(createTheaterInputSchema),
    defaultValues: {
      name: "",
      locationId: "",
    },
  });

  const onSubmit = (data: CreateTheaterInput) => {
    createTheater.mutate({ data });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Create Theater"
        isDone={createTheater.isSuccess}
        triggerButton={
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Theater
          </Button>
        }
        submitButton={
          <SubmitButton
            type={SubmitButtonType.CREATE}
            form="create-theater-form"
            isPending={createTheater.isPending}
          >
            Create Theater
          </SubmitButton>
        }
        size="lg"
      >
        <Form {...form}>
          <form
            id="create-theater-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theater Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter theater name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the theater (e.g., "Theater A", "IMAX Hall 1")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingLocations}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingLocations ? (
                        <SelectItem value="loading" disabled>
                          Loading locations...
                        </SelectItem>
                      ) : locationsData?.data.locations?.length === 0 ? (
                        <SelectItem value="no-locations" disabled>
                          No locations available
                        </SelectItem>
                      ) : (
                        locationsData?.data.locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {location.name}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the location where this theater is located.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("locationId") && locationsData?.data.locations && (
              <div className="space-y-2">
                <FormLabel className="text-foreground font-medium">
                  Location Preview
                </FormLabel>
                <div className="border border-border rounded-lg p-4 bg-card mt-2">
                  {(() => {
                    const selectedLocation = locationsData.data.locations.find(
                      (loc) => loc.id === form.watch("locationId")
                    );
                    return selectedLocation ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-primary" />
                          <span className="font-medium text-foreground">
                            {selectedLocation.name}
                          </span>
                        </div>
                        {selectedLocation.address && (
                          <p className="text-sm text-muted-foreground">
                            {selectedLocation.address}
                          </p>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            )}
          </form>
        </Form>
      </FormSheet>
    </Authorization>
  );
};
