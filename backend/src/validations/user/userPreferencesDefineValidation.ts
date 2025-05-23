import { z } from "zod";

// Define a schema for user creation validation
const userPreferenceDefine = z.object({
    typeId: z.string().nonempty(),
});

export default userPreferenceDefine;