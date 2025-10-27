import { Authorization, ROLES } from "@/lib/authorization";
import {
  useUpdateTheater,
  updateTheaterInputSchema,
  UpdateTheaterInput,
} from "../api/update-theater";
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
import { Edit, Building } from "lucide-react";
import {
  SubmitButton,
  SubmitButtonType,
} from "@/components/ui/form/submit-button";
import { useLocations } from "@/features/locations/api/get-locations";
import { Theater } from "@/lib/api";
import { useNotifications } from "@/components/ui/notification/notification-store";

interface UpdateTheaterProps {
  theater: Theater;
}

export const UpdateTheater = ({ theater }: UpdateTheaterProps) => {
  const { data: locationsData, isLoading: isLoadingLocations } = useLocations({
    all: true,
  });

  const updateTheater = useUpdateTheater({
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

  const form = useForm<UpdateTheaterInput>({
    resolver: zodResolver(updateTheaterInputSchema),
    defaultValues: {
      name: theater.name,
      locationId: theater.location?.id || "",
    },
  });

  const onSubmit = (data: UpdateTheaterInput) => {
    updateTheater.mutate({ data, theaterId: theater.id });
  };

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormSheet
        title="Update Theater"
        isDone={updateTheater.isSuccess}
        triggerButton={
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit className="w-4 h-4" />
          </Button>
        }
        submitButton={
          <SubmitButton
            type={SubmitButtonType.UPDATE}
            form="update-theater-form"
            isPending={updateTheater.isPending}
          >
            Update Theater
          </SubmitButton>
        }
        size="lg"
      >
        <Form {...form}>
          <form
            id="update-theater-form"
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
                    value={field.value}
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

            <div className="space-y-2">
              <FormLabel className="text-foreground font-medium">
                Current Theater Information
              </FormLabel>
              <div className="border border-border rounded-lg p-4 bg-card">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">
                      {theater.name}
                    </span>
                  </div>
                  {theater.location && (
                    <div className="text-sm text-muted-foreground">
                      <p>Current Location: {theater.location.name}</p>
                      {theater.location.address && (
                        <p>{theater.location.address}</p>
                      )}
                    </div>
                  )}
                  {theater.seats && (
                    <p className="text-sm text-muted-foreground">
                      Current Capacity: {theater.seats.length} seats
                    </p>
                  )}
                </div>
              </div>
            </div>

            {form.watch("locationId") && locationsData?.data.locations && (
              <div className="space-y-2">
                <FormLabel className="text-foreground font-medium">
                  New Location Preview
                </FormLabel>
                <div className="border border-border rounded-lg p-4 bg-card">
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
