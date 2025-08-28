// 兑换token参数
export class GoogleGetTokenParamDto {
  /** 从初始请求返回的授权码 。 */
  code: string;
  /** 您从 Cloud Console客户端页面获取的客户端 ID ，如 获取 OAuth 2.0 凭据中所述。 */
  client_id: string;
  /** 您从 Cloud Console 客户端页面获取的客户端密钥，如 获取 OAuth 2.0 凭据中所述。 */
  client_secret: string;
  /** 在 Cloud Console 客户端页面中指定的给定授权重定向 URI ，如 设置重定向 URI中所述。client_id */
  redirect_uri: string;
  /** 该字段必须包含 的值， 如 OAuth 2.0 规范中所定义。authorization_code */
  grant_type: string;
}

// 兑换token结果
export class GoogleAccessTokenResDto {
  /** 可以发送到 Google API 的令牌。 */
  access_token: string;
  /** 访问令牌的剩余有效期（以秒为单位）。 */
  expires_in: number;
  /** 包含由 Google 数字签名的用户身份信息的JWT 。 */
  id_token: string;
  /** 授予的访问范围表示为以空格分隔的区分大小写的字符串列表。access_token */
  scope: string;
  /** 标识返回的令牌类型。目前，此字段的值始终为 Bearer。 */
  token_type: 'Bearer';
  /**
   *（选修的）
   * 仅当身份验证请求中将access_type参数设置为 时，此字段才会出现 。有关详情，请参阅刷新令牌。offline
   */
  refresh_token: string;
}

export class IDTokenDto {
  /**
   * 此 ID 令牌的目标受众。它必须是您应用程序的 OAuth 2.0 客户端 ID 之一。
   */
  aud: string;
  /**
   * 到期时间，在此时间或之后，ID 令牌不得被接受。以 Unix 纪元时间（整数秒）表示。
   */
  exp: number;
  /**
   * ID 令牌的签发时间。以 Unix 纪元时间（整数秒）表示。
   */
  iat: number;
  /**
   * 响应发行者的发行者标识符。始终为该值 ，或者对于 Google ID 令牌为该值。https://accounts.google.comaccounts.google.com
   */
  iss: string;
  /**
   * 用户的标识符，在所有 Google 帐户中唯一且永不重复使用。一个 Google 帐户在不同时间点可以拥有多个电子邮件地址，但该 sub值永不更改。sub在您的应用中用作用户的唯一标识符键。最大长度为 255 个 ASCII 字符（区分大小写）。
   */
  sub: string;
  /**
   * 访问令牌哈希。用于验证访问令牌是否与身份令牌关联。如果身份令牌在服务器流程中签发时带有值，则始终会包含此声明。此声明可用作防范跨站请求伪造攻击的替代机制，但如果您遵循 步骤 1和步骤 3，则无需验证访问令牌。access_token
   */
  at_hash?: string;
  /**
   * 授权呈现者的声明。仅当请求 ID 令牌的一方与 ID 令牌的接收方不同时，才需要此声明。在 Google 的混合应用中，Web 应用和 Android 应用可能使用不同的 OAuth 2.0，但共享相同的 Google API 项目。client_idclient_id
   */
  azp?: string;
  /**
   * 用户的电子邮件地址。仅当您email在请求中包含范围时才提供。此声明的值可能并非此帐号的唯一值，并且可能会随时间而变化，因此您不应使用此值作为链接到用户记录的主要标识符。您也不能依赖声明的域名email来识别 Google Workspace 或 Cloud 组织的用户；请改用hd声明本身。
   */
  email?: string;
  /**
   * 如果用户的电子邮件地址已经验证，则为 True；否则为 false。
   */
  email_verified?: boolean;
  /**
   * 用户的姓氏。在 name存在声明时可能会提供。
   */
  family_name?: string;
  /**
   * 用户的名字。当 name存在声明时可能会提供。
   */
  given_name?: string;
  /**
   * 与用户的 Google Workspace 或 Cloud 组织关联的域名。仅当用户属于 Google Cloud 组织时才提供。在将资源访问权限限制为仅限特定网域的成员时，必须检查此声明。如果没有此声明，则表示该帐号不属于 Google 托管的网域。
   */
  hd?: string;
  /**
   * 用户的语言环境，以 BCP 47name语言标签表示。存在声明时可能会提供。
   */
  locale?: string;
  /**
   * 以可显示形式呈现的用户全名。可能在以下情况下提供：
   * 请求范围包含字符串“profile”
   * ID 令牌是从令牌刷新返回的
   * 当name声明存在时，您可以使用它们来更新应用的用户记录。请注意，此声明永远不保证一定存在。
   */
  name?: string;
  /**
   * 您的应用在身份验证请求中提供的值nonce。您应该通过仅提供一次此值来防止重放攻击。
   */
  nonce?: string;
  /**
   * 用户个人资料图片的 URL。可能在以下情况下提供：
   * 请求范围包含字符串“profile”
   * ID 令牌是从令牌刷新返回的
   * 当picture声明存在时，您可以使用它们来更新应用的用户记录。请注意，此声明永远不保证一定存在。
   */
  picture?: string;
  /**
   * 用户个人资料页面的 URL。可能在以下情况下提供：
   * 请求范围包含字符串“profile”
   * ID 令牌是从令牌刷新返回的
   * 当profile声明存在时，您可以使用它们来更新应用的用户记录。请注意，此声明永远不保证一定存在。
   */
  profile?: string;
}
