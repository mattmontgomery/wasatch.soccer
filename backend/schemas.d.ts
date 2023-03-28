import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  BigIntegerAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  UIDAttribute,
  RichTextAttribute,
  MediaAttribute,
  ComponentAttribute,
  DynamicZoneAttribute,
  TextAttribute,
  SingleTypeSchema,
  ComponentSchema,
} from "@strapi/strapi";

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: "Permission";
    description: "";
    singularName: "permission";
    pluralName: "permissions";
    displayName: "Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<"admin::permission", "manyToOne", "admin::role">;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "admin::permission",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "admin::permission",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: "User";
    description: "";
    singularName: "user";
    pluralName: "users";
    displayName: "User";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<"admin::user", "manyToMany", "admin::role"> &
      PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<"admin::user", "oneToOne", "admin::user"> &
      PrivateAttribute;
    updatedBy: RelationAttribute<"admin::user", "oneToOne", "admin::user"> &
      PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: "Role";
    description: "";
    singularName: "role";
    pluralName: "roles";
    displayName: "Role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<"admin::role", "manyToMany", "admin::user">;
    permissions: RelationAttribute<
      "admin::role",
      "oneToMany",
      "admin::permission"
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<"admin::role", "oneToOne", "admin::user"> &
      PrivateAttribute;
    updatedBy: RelationAttribute<"admin::role", "oneToOne", "admin::user"> &
      PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: "Api Token";
    singularName: "api-token";
    pluralName: "api-tokens";
    displayName: "Api Token";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<"">;
    type: EnumerationAttribute<["read-only", "full-access", "custom"]> &
      RequiredAttribute &
      DefaultTo<"read-only">;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: DateTimeAttribute;
    permissions: RelationAttribute<
      "admin::api-token",
      "oneToMany",
      "admin::api-token-permission"
    >;
    expiresAt: DateTimeAttribute;
    lifespan: BigIntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "admin::api-token",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "admin::api-token",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface AdminApiTokenPermission extends CollectionTypeSchema {
  info: {
    name: "API Token Permission";
    description: "";
    singularName: "api-token-permission";
    pluralName: "api-token-permissions";
    displayName: "API Token Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    token: RelationAttribute<
      "admin::api-token-permission",
      "manyToOne",
      "admin::api-token"
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "admin::api-token-permission",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "admin::api-token-permission",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: "file";
    pluralName: "files";
    displayName: "File";
    description: "";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<"plugin::upload.file", "morphToMany">;
    folder: RelationAttribute<
      "plugin::upload.file",
      "manyToOne",
      "plugin::upload.folder"
    > &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "plugin::upload.file",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "plugin::upload.file",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: "folder";
    pluralName: "folders";
    displayName: "Folder";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<
      "plugin::upload.folder",
      "manyToOne",
      "plugin::upload.folder"
    >;
    children: RelationAttribute<
      "plugin::upload.folder",
      "oneToMany",
      "plugin::upload.folder"
    >;
    files: RelationAttribute<
      "plugin::upload.folder",
      "oneToMany",
      "plugin::upload.file"
    >;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "plugin::upload.folder",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "plugin::upload.folder",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface PluginI18NLocale extends CollectionTypeSchema {
  info: {
    singularName: "locale";
    pluralName: "locales";
    collectionName: "locales";
    displayName: "Locale";
    description: "";
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: StringAttribute & UniqueAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "plugin::i18n.locale",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "plugin::i18n.locale",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: "permission";
    description: "";
    singularName: "permission";
    pluralName: "permissions";
    displayName: "Permission";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      "plugin::users-permissions.permission",
      "manyToOne",
      "plugin::users-permissions.role"
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "plugin::users-permissions.permission",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "plugin::users-permissions.permission",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: "role";
    description: "";
    singularName: "role";
    pluralName: "roles";
    displayName: "Role";
  };
  pluginOptions: {
    "content-manager": {
      visible: false;
    };
    "content-type-builder": {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      "plugin::users-permissions.role",
      "oneToMany",
      "plugin::users-permissions.permission"
    >;
    users: RelationAttribute<
      "plugin::users-permissions.role",
      "oneToMany",
      "plugin::users-permissions.user"
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "plugin::users-permissions.role",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "plugin::users-permissions.role",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: "user";
    description: "";
    singularName: "user";
    pluralName: "users";
    displayName: "User";
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      "plugin::users-permissions.user",
      "manyToOne",
      "plugin::users-permissions.role"
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "plugin::users-permissions.user",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "plugin::users-permissions.user",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface ApiAuthorAuthor extends CollectionTypeSchema {
  info: {
    singularName: "author";
    pluralName: "authors";
    displayName: "Author";
    description: "";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: StringAttribute;
    slug: UIDAttribute<"api::author.author", "name"> &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 4;
        maxLength: 128;
      }>;
    bio: RichTextAttribute;
    photo: MediaAttribute;
    title: StringAttribute;
    displayOnMasthead: BooleanAttribute & DefaultTo<true>;
    socialLinks: ComponentAttribute<"links.social-links">;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "api::author.author",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "api::author.author",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface ApiGroupGroup extends CollectionTypeSchema {
  info: {
    singularName: "group";
    pluralName: "groups";
    displayName: "Group";
    description: "";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: StringAttribute;
    description: RichTextAttribute;
    isColumn: BooleanAttribute & RequiredAttribute & DefaultTo<false>;
    slug: UIDAttribute<"api::group.group", "name">;
    groupType: EnumerationAttribute<["column", "section", "grouping"]>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "api::group.group",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "api::group.group",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface ApiPagePage extends CollectionTypeSchema {
  info: {
    singularName: "page";
    pluralName: "pages";
    displayName: "Page";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: StringAttribute;
    gridSlots: DynamicZoneAttribute<
      [
        "modules.feed",
        "modules.auto-post",
        "modules.newsletter",
        "modules.text",
        "modules.stream"
      ]
    >;
    groups: RelationAttribute<
      "api::page.page",
      "oneToMany",
      "api::group.group"
    >;
    slug: UIDAttribute<"api::page.page", "title">;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<"api::page.page", "oneToOne", "admin::user"> &
      PrivateAttribute;
    updatedBy: RelationAttribute<"api::page.page", "oneToOne", "admin::user"> &
      PrivateAttribute;
  };
}

export interface ApiPostPost extends CollectionTypeSchema {
  info: {
    singularName: "post";
    pluralName: "posts";
    displayName: "Post";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    headline: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 4;
        maxLength: 256;
      }>;
    summary: TextAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 8;
      }>;
    body: RichTextAttribute;
    slug: StringAttribute & RequiredAttribute;
    leadPhoto: MediaAttribute;
    authors: RelationAttribute<
      "api::post.post",
      "oneToMany",
      "api::author.author"
    >;
    groups: RelationAttribute<
      "api::post.post",
      "oneToMany",
      "api::group.group"
    >;
    primaryGroup: RelationAttribute<
      "api::post.post",
      "oneToOne",
      "api::group.group"
    >;
    published: DateTimeAttribute;
    streams: RelationAttribute<
      "api::post.post",
      "manyToMany",
      "api::stream.stream"
    >;
    related: RelationAttribute<"api::post.post", "manyToOne", "api::post.post">;
    posts: RelationAttribute<"api::post.post", "oneToMany", "api::post.post">;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<"api::post.post", "oneToOne", "admin::user"> &
      PrivateAttribute;
    updatedBy: RelationAttribute<"api::post.post", "oneToOne", "admin::user"> &
      PrivateAttribute;
  };
}

export interface ApiSiteConfigSiteConfig extends SingleTypeSchema {
  info: {
    singularName: "site-config";
    pluralName: "site-configs";
    displayName: "Site Config";
    description: "";
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    siteName: StringAttribute;
    siteDescription: StringAttribute;
    homepageTitleText: StringAttribute;
    navigationGroups: RelationAttribute<
      "api::site-config.site-config",
      "oneToMany",
      "api::group.group"
    >;
    podcastFeed: StringAttribute;
    newsletterSignup: StringAttribute;
    about: RichTextAttribute;
    twitter: StringAttribute;
    facebook: StringAttribute;
    instagram: StringAttribute;
    themePrimary: StringAttribute &
      SetMinMaxLength<{
        maxLength: 6;
      }>;
    themeAlternate: StringAttribute &
      SetMinMaxLength<{
        maxLength: 6;
      }>;
    themePrimaryDark: StringAttribute &
      SetMinMaxLength<{
        maxLength: 6;
      }>;
    themeAlternateDark: StringAttribute &
      SetMinMaxLength<{
        maxLength: 6;
      }>;
    themePrimaryContrast: StringAttribute &
      SetMinMaxLength<{
        maxLength: 6;
      }>;
    themeAlternateContrast: StringAttribute &
      SetMinMaxLength<{
        maxLength: 6;
      }>;
    logoLightMode: StringAttribute;
    logoDarkMode: StringAttribute;
    navigationItems: ComponentAttribute<"links.navigation-items", true>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "api::site-config.site-config",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "api::site-config.site-config",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface ApiStreamStream extends CollectionTypeSchema {
  info: {
    singularName: "stream";
    pluralName: "streams";
    displayName: "Stream";
    description: "";
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: StringAttribute;
    body: RichTextAttribute;
    slug: UIDAttribute<"api::stream.stream", "name">;
    posts: RelationAttribute<
      "api::stream.stream",
      "manyToMany",
      "api::post.post"
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      "api::stream.stream",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      "api::stream.stream",
      "oneToOne",
      "admin::user"
    > &
      PrivateAttribute;
  };
}

export interface LinksNavigationItems extends ComponentSchema {
  info: {
    displayName: "navigationItems";
  };
  attributes: {
    url: StringAttribute;
    label: StringAttribute;
  };
}

export interface LinksSocialLinks extends ComponentSchema {
  info: {
    displayName: "Social Links";
    description: "";
  };
  attributes: {
    facebook: StringAttribute;
    instagram: StringAttribute;
    twitter: StringAttribute;
    mastodon: StringAttribute;
    podcast: StringAttribute;
    youtube: StringAttribute;
    website: StringAttribute;
    github: StringAttribute;
    linkedIn: StringAttribute;
    newsletter: StringAttribute;
  };
}

export interface ModulesAutoPost extends ComponentSchema {
  info: {
    displayName: "autoPost";
    description: "";
  };
  attributes: {
    isHero: BooleanAttribute;
    pinnedPost: RelationAttribute<
      "modules.auto-post",
      "oneToOne",
      "api::post.post"
    >;
  };
}

export interface ModulesFeed extends ComponentSchema {
  info: {
    displayName: "feed";
  };
  attributes: {
    feedUrl: StringAttribute;
    title: StringAttribute;
    body: RichTextAttribute;
  };
}

export interface ModulesNewsletter extends ComponentSchema {
  info: {
    displayName: "newsletter";
  };
  attributes: {
    title: StringAttribute;
    url: StringAttribute;
    body: RichTextAttribute;
  };
}

export interface ModulesPost extends ComponentSchema {
  info: {
    displayName: "post";
    description: "";
  };
  attributes: {
    post: RelationAttribute<"modules.post", "oneToOne", "api::post.post">;
    headline: StringAttribute;
    slotNumber: IntegerAttribute;
    isHero: BooleanAttribute;
  };
}

export interface ModulesStream extends ComponentSchema {
  info: {
    displayName: "stream";
    description: "";
  };
  attributes: {
    stream: RelationAttribute<
      "modules.stream",
      "oneToOne",
      "api::stream.stream"
    >;
    coverImage: MediaAttribute;
  };
}

export interface ModulesText extends ComponentSchema {
  info: {
    displayName: "text";
    description: "";
  };
  attributes: {
    title: StringAttribute;
    body: RichTextAttribute;
    coverImage: MediaAttribute;
    url: StringAttribute;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      "admin::permission": AdminPermission;
      "admin::user": AdminUser;
      "admin::role": AdminRole;
      "admin::api-token": AdminApiToken;
      "admin::api-token-permission": AdminApiTokenPermission;
      "plugin::upload.file": PluginUploadFile;
      "plugin::upload.folder": PluginUploadFolder;
      "plugin::i18n.locale": PluginI18NLocale;
      "plugin::users-permissions.permission": PluginUsersPermissionsPermission;
      "plugin::users-permissions.role": PluginUsersPermissionsRole;
      "plugin::users-permissions.user": PluginUsersPermissionsUser;
      "api::author.author": ApiAuthorAuthor;
      "api::group.group": ApiGroupGroup;
      "api::page.page": ApiPagePage;
      "api::post.post": ApiPostPost;
      "api::site-config.site-config": ApiSiteConfigSiteConfig;
      "api::stream.stream": ApiStreamStream;
      "links.navigation-items": LinksNavigationItems;
      "links.social-links": LinksSocialLinks;
      "modules.auto-post": ModulesAutoPost;
      "modules.feed": ModulesFeed;
      "modules.newsletter": ModulesNewsletter;
      "modules.post": ModulesPost;
      "modules.stream": ModulesStream;
      "modules.text": ModulesText;
    }
  }
}
