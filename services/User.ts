import { autoInjectable, singleton } from '~/node_modules/tsyringe';
import { BehaviorSubject } from '~/node_modules/rxjs';
import { AuthApiService, LoginData } from '~/services/Apis/Auth';
import { User } from '~/models/auth/User';

@singleton()
@autoInjectable()
export class UserService {
    static AUTH_TOKEN_STORAGE_KEY = 'auth';
    private tokenStorage: OkunaStorage<string>;

    private loggedInUser = new BehaviorSubject<User | undefined>(undefined);

    constructor(private authApiService?: AuthApiService, storageService?: StorageService) {
        this.tokenStorage = storageService!.getLocalForageStorage('userTokenStorage');
    }

    async loginWithCredentials(data: LoginData): Promise<void> {
        const response = await this.authApiService!.login(data);
        await this.loginWithAuthToken(response.data.token);
    }

    async logout() {
        await this.tokenStorage.remove(UserService.AUTH_TOKEN_STORAGE_KEY);
    }

    hasStoredAuthToken() {
        return this.tokenStorage.has(UserService.AUTH_TOKEN_STORAGE_KEY);
    }

    getStoredAuthToken() {
        return this.tokenStorage.get(UserService.AUTH_TOKEN_STORAGE_KEY);
    }

    async loginWithAuthToken(token: string) {
        await this.storeAuthToken(token);
        await this.loginWithStoredAuthToken();
    }

    async loginWithStoredAuthToken() {
        await this.refreshLoggedInUser();
    }

    async refreshLoggedInUser() {
        const response = await this.authApiService!.getAuthenticatedUser();
        this.setLoggedInUser(User.factory.make(response.data, {
            // This cache stays for as long as the user session is active
            storeInSessionCache: true
        }));
    }

    private setLoggedInUser(user: User): void {
        this.loggedInUser.next(user);
    }

    private storeAuthToken(token: string) {
        return this.tokenStorage.set(UserService.AUTH_TOKEN_STORAGE_KEY, token);
    }
}