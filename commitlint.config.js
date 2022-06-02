module.exports = {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-lerna-scopes',
  ],
  // 以下时我们自定义的规则
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能（feature）
        'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'docs', // 文档（documentation）
        'style', // 格式（不影响代码运行的变动）
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'build', //
        'ci',
        'chore', // 构建过程或辅助工具的变动
        'revert', // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
      ],
    ],
  },
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: '最多 %d 字符',
      min: '%d chars at least',
      emptyWarning: '不能为空',
      upperLimitWarning: '超限',
      lowerLimitWarning: '低于限制',
    },
    questions: {
      type: {
        description: '选择您要提交的更改类型',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨',
          },
          bug: {
            description: '修复BUG',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '变更文档',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '不影响代码含义的更改（空格、格式、缺少分号等）',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '重构代码。不包括 BUG 修复、功能新增',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '性能优化',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '测试用例（添加、修改）',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description:
              '构建流程、外部依赖变更，比如升级 npm 包、修改 webpack 配置',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: '修改 CI 配置、脚本',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description:
              '对构建过程或辅助工具和库的更改,不影响源文件、测试用例的其他操作',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '回滚 commit',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: '此更改的范围是什么（例如组件或文件名）',
      },
      subject: {
        description: '写一个简短的、命令式的变化描述',
      },
      body: {
        description: '提供更详细的更改说明',
      },
      isBreaking: {
        description: '是否有任何重大变化?',
      },
      breakingBody: {
        description: '重大变化 提交需要一个主体。 请输入对提交本身的更长描述',
      },
      breaking: {
        description: '描述重大变化',
      },
      isIssueAffected: {
        description: '此更改是否会影响任何未解决的问题?',
      },
      issuesBody: {
        description:
          '如果问题已关闭，则提交需要一个正文。 请输入对提交本身的更长描述',
      },
      issues: {
        description: '添加问题参考（例如“fix #123”、“re #123”。）',
      },
    },
  },
};
