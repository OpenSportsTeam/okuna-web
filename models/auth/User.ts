import { IUpdatableModelData, UpdatableModel } from '~/models/abstract/UpdatableModel';

import { IModelFactory } from '~/interfaces/IModelFactory';
import { LruCache } from '~/lib/caches/LruCache';
import { Circle, ICircleData } from '~/models/auth/Circle';

class UserFactory implements IModelFactory<User, IUserData> {
    private sessionUsersCache: LruCache<number, User> = new LruCache(10);
    private navigationUsersCache: LruCache<number, User> = new LruCache(100);

    make(data: IUserData, config: {storeInSessionCache: boolean} = {storeInSessionCache: true}): User {
        const userId = data.id;

        let user = this.navigationUsersCache.get(userId) || this.sessionUsersCache.get(userId);

        if (user) {
            user.update(data);
            return user;
        }

        user = new User(data);
        config.storeInSessionCache
            ? this.sessionUsersCache.set(userId, user)
            : this.navigationUsersCache.set(userId, user);

        return user;
    }
}


export class User extends UpdatableModel<User, IUserData> {

    static factory = new UserFactory();

    updatableDataToAttributesMap =  {
        uuid: 'uuid',
        are_guidelines_accepted: 'areGuidelinesAccepted',
        connections_circle_id: 'connectionsCircleId',
        followers_count: 'followersCount',
        posts_count: 'postsCount',
        invite_count: 'inviteCount',
        unread_notifications_count: 'unreadNotificationsCount',
        pending_communities_moderated_objects_count: 'pendingCommunitiesModeratedObjectsCount',
        active_moderation_penalties_count: 'activeModerationPenaltiesCount',
        email: 'email',
        username: 'username',
        following_count: 'followingCount',
        is_following: 'isFollowing',
        is_connected: 'isConnected',
        is_global_moderator: 'isGlobalModerator',
        is_blocked: 'isBlocked',
        is_reported: 'isReported',
        is_fully_connected: 'isFullyConnected',
        is_member_of_communities: 'isMemberOfCommunities',
        is_pending_connection_confirmation: 'isPendingConnectionConfirmation',
        connected_circles: {
            targetAttribute: 'connectedCircles',
            updater(instance: User, circlesData: ICircleData[]){
                return circlesData.map((circleData)=> Circle.factory.make(circleData));
            }
        }
    };

    uuid!: string;
    areGuidelinesAccepted!: boolean;
    connectionsCircleId!: number;
    followersCount!: number;
    postsCount!: number;
    inviteCount!: number;
    unreadNotificationsCount!: number;
    pendingCommunitiesModeratedObjectsCount!: number;
    activeModerationPenaltiesCount!: number;
    email!: string;
    username!: string;
    followingCount!: number;
    isFollowing!: boolean;
    isConnected!: boolean;
    isGlobalModerator!: boolean;
    isBlocked!: boolean;
    isReported!: boolean;
    isFullyConnected!: boolean;
    isMemberOfCommunities!: boolean;
    isPendingConnectionConfirmation!: boolean;

    connectedCircles!: Circle[];

    constructor(data: IUserData) {
        super(data);
    }
}

export interface IUserData extends IUpdatableModelData {
    id: number,
    uuid: string,
    are_guidelines_accepted: boolean,
    connections_circle_id: number,
    followers_count: number,
    posts_count: number,
    invite_count: number,
    unread_notifications_count: number,
    pending_communities_moderated_objects_count: number,
    is_pending_connection_confirmation: boolean,
    active_moderation_penalties_count: number,
    email: string,
    username: string,
    following_count: number,
    is_following: boolean,
    is_connected: boolean,
    is_global_moderator: boolean,
    is_blocked: boolean,
    is_reported: boolean,
    is_fully_connected: boolean,
    is_member_of_communities: boolean,
}