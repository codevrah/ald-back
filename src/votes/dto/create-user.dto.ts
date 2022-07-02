export class CreateUserDto {
    constructor(userId: string, displayName: string, email: string){
        this.userId = userId;
        this.displayName = displayName;
        this.email = email;
    }
    userId: string;
    displayName: string;
    email: string;
}
