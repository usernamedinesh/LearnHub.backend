import { IsArray, IsNotEmpty, IsObject, IsString} from 'class-validator';

export class InstructorRequestDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  expertise: string[];

  @IsObject()
  @IsNotEmpty()
  socialLinks: Record<string, string>;

  @IsObject()
  @IsNotEmpty()
  paymentDetails: Record<string, any>;
}
