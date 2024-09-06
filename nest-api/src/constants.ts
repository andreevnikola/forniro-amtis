import { IsMongoId, IsNotEmpty } from 'class-validator';

export const DB_CONN = 'DATABASE_CONNECTION';

export class ValidatedIdParam {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

export class FoundAndSucessObject {
  found: boolean;
  success: boolean;
}
