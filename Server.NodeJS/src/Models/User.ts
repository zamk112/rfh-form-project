class User {
    public Id: number;
    public UserName: string;
    public Email: string;
    public CreatedAt: Date;
    public UpdatedAt: Date;

    public constructor(Id: number, UserName: string, Email: string, CreatedAt: Date, UpdatedAt: Date) {
        this.Id = Id;
        this.UserName = UserName;
        this.Email = Email;
        this.CreatedAt = CreatedAt;
        this.UpdatedAt = UpdatedAt;
    }

    public toJSON?(): object {
        return {
            id: this.Id,
            username: this.UserName,
            email: this.Email,
            createAt: this.CreatedAt,
            updatedAt: this.UpdatedAt
        };
    }    
}

export default User;